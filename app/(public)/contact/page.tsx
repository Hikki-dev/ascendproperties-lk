import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Get in Touch</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Have questions about a property or need expert advice? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light">
              <h3 className="text-xl font-bold text-text-primary mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Phone</p>
                    <a href="tel:+94761500000" className="text-text-secondary hover:text-primary transition-colors">
                      +94 76 150 0000
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Email</p>
                    <a href="mailto:info@ascendproperties.lk" className="text-text-secondary hover:text-primary transition-colors">
                      info@ascendproperties.lk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Office</p>
                    <p className="text-text-secondary">
                      6, 4 R. A. De Mel Mawatha,<br />Colombo 00400
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border-light">
                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                  <a href="https://wa.me/94761500000" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border-light">
              <h3 className="text-xl font-bold text-text-primary mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary outline-none bg-background"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary outline-none bg-background"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary outline-none bg-background"
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary outline-none bg-background resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button type="submit" size="lg" variant="primary" className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
