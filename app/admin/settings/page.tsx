import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-primary mt-2">Manage your account and website preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <h2 className="text-xl font-bold text-text-primary mb-4">Profile Settings</h2>
          <div className="grid gap-6 max-w-xl">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Display Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-border-light bg-background text-text-primary focus:border-primary outline-none"
                defaultValue="Admin User"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 rounded-lg border border-border-light bg-background text-text-primary focus:border-primary outline-none"
                defaultValue="admin@ascend.lk"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border-light">
          <h2 className="text-xl font-bold text-text-primary mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary" defaultChecked />
              <span className="text-text-primary font-medium">Email me when a new enquiry is received</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary" defaultChecked />
              <span className="text-text-primary font-medium">Email me about system updates</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
