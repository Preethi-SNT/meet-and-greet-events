# frozen_string_literal: true

require "sinatra"
require "sinatra/json"
require "securerandom"
require "rack/cors"
require "time"
require "sendgrid-ruby"
require "mail"

use Rack::Cors do
  allow do
    origins "*"
    resource "*", headers: :any, methods: %i[get post options]
  end
end

set :bind, "0.0.0.0"
set :port, 4567
set :protection, except: :http_origin

SUBMISSIONS = []

before do
  content_type :json
end

helpers do
  def send_email(submission)
    # Prefer SendGrid if configured
    if ENV["SENDGRID_API_KEY"] && ENV["CONTACT_RECIPIENT"]
      send_via_sendgrid(submission)
    # Fallback to SMTP if provided
    elsif ENV["EMAIL_SMTP_SERVER"] && ENV["EMAIL_USER"] && ENV["EMAIL_PASSWORD"] && ENV["CONTACT_RECIPIENT"]
      send_via_smtp(submission)
    else
      { delivered: false, reason: "No email provider configured" }
    end
  end

  def build_body(submission)
    [
      "Name: #{submission[:name]}",
      "Email: #{submission[:email]}",
      ("Phone: #{submission[:phone]}" if submission[:phone].to_s.strip != ""),
      ("Event type: #{submission[:event_type]}" if submission[:event_type].to_s.strip != ""),
      "Message:",
      submission[:message].to_s.strip,
      "",
      "Received at: #{submission[:received_at]}"
    ].compact.join("\n")
  end

  def send_via_sendgrid(submission)
    api_key = ENV["SENDGRID_API_KEY"]
    to_email = ENV["CONTACT_RECIPIENT"]
    from_email = ENV["CONTACT_FROM"] || "no-reply@meetandgreet.events"
    return { delivered: false, reason: "SENDGRID_API_KEY or CONTACT_RECIPIENT not set" } unless api_key && to_email

    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: from_email, name: "Meet & Greet Events")
    mail.subject = "New inquiry from #{submission[:name]} (#{submission[:event_type] || 'Event inquiry'})"
    mail.add_personalization(
      SendGrid::Personalization.new.tap do |p|
        p.add_to(SendGrid::Email.new(email: to_email))
      end
    )
    mail.add_content(SendGrid::Content.new(type: "text/plain", value: build_body(submission)))

    begin
      sg = SendGrid::API.new(api_key: api_key)
      response = sg.client.mail._("send").post(request_body: mail.to_json)
      ok = response.status_code.to_i < 300
      { delivered: ok, provider: "sendgrid", status: response.status_code }
    rescue StandardError => e
      { delivered: false, provider: "sendgrid", error: e.message }
    end
  end

  def send_via_smtp(submission)
    to_email = ENV["CONTACT_RECIPIENT"]
    from_email = ENV["CONTACT_FROM"] || ENV["EMAIL_USER"] || "no-reply@meetandgreet.events"
    opts = {
      address: ENV["EMAIL_SMTP_SERVER"],
      port: (ENV["EMAIL_PORT"] || "587").to_i,
      domain: ENV["EMAIL_DOMAIN"] || "localhost",
      user_name: ENV["EMAIL_USER"],
      password: ENV["EMAIL_PASSWORD"],
      authentication: :login,
      enable_starttls_auto: true
    }

    mail = Mail.new do
      from    from_email
      to      to_email
      subject "New inquiry from #{submission[:name]} (#{submission[:event_type] || 'Event inquiry'})"
      body    build_body(submission)
    end

    begin
      mail.delivery_method(:smtp, opts)
      mail.deliver!
      { delivered: true, provider: "smtp" }
    rescue StandardError => e
      { delivered: false, provider: "smtp", error: e.message }
    end
  end
end

get "/api/health" do
  json ok: true, service: "meet-and-greet-events"
end

post "/api/contact" do
  payload = params.transform_keys(&:to_s)
  required = %w[name email message]
  missing = required.select { |k| (payload[k] || "").strip.empty? }
  halt 422, json(error: "Missing fields: #{missing.join(', ')}") unless missing.empty?

  submission = {
    id: SecureRandom.uuid,
    name: payload["name"],
    email: payload["email"],
    phone: payload["phone"],
    event_type: payload["event_type"],
    message: payload["message"],
    received_at: Time.now.utc.iso8601,
  }

  SUBMISSIONS << submission
  delivery = send_email(submission)
  status(delivery[:delivered] ? 201 : 202)
  json submission: submission, delivery: delivery
end

get "/api/services" do
  json services: [
    { tag: "Weddings", title: "Weddings", copy: "Custom-designed weddings that reflect each couple." },
    { tag: "Pre-wedding", title: "Sangeet", copy: "High-energy sangeets with choreography and music." },
    { tag: "Pre-wedding", title: "Mehndi", copy: "Colourful mehndis with decor, artists, and music." },
    { tag: "Pre-wedding", title: "Haldi", copy: "Vibrant haldis with floral touches and lively ambience." },
    { tag: "Wedding", title: "Receptions", copy: "Elegant receptions with curated food, music, and atmosphere." },
    { tag: "Family", title: "Cradle Ceremonies", copy: "Graceful welcomes blending tradition and thoughtful decor." },
    { tag: "Milestones", title: "Birthdays", copy: "Memorable birthdays designed around the guest of honour." },
    { tag: "Milestones", title: "Engagements", copy: "Engagement ceremonies with tasteful decor and experiences." },
  ]
end

get "/api/gallery" do
  json gallery: [
    { title: "Wedding Decor", blurb: "From your wedding designs pages", src: "/images/wedding-1.jpg" },
    { title: "Sangeet Evening", blurb: "Energy, music, and performances", src: "/images/sangeet-1.jpg" },
    { title: "Haldi Ceremony", blurb: "Bright, joyful, and vibrant", src: "/images/haldi-1.jpg" },
    { title: "Birthday Celebration", blurb: "Personal, warm, and festive", src: "/images/birthday-1.jpg" },
  ]
end
