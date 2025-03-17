"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [accountId, setAccountId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [apiTokenVisible, setApiTokenVisible] = useState(false);
  const [secretKeyVisible, setSecretKeyVisible] = useState(false);
  const [region, setRegion] = useState("auto");
  const [isSaving, setIsSaving] = useState(false);

  // Load saved credentials from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      const savedAccountId =
        localStorage.getItem("cloudflare_account_id") || "";
      const savedApiToken = localStorage.getItem("cloudflare_api_token") || "";
      const savedAccessKeyId =
        localStorage.getItem("cloudflare_access_key_id") || "";
      const savedSecretAccessKey =
        localStorage.getItem("cloudflare_secret_access_key") || "";
      const savedEndpoint =
        localStorage.getItem("cloudflare_r2_endpoint") || "";
      const savedRegion = localStorage.getItem("cloudflare_region") || "auto";

      setAccountId(savedAccountId);
      setApiToken(savedApiToken);
      setAccessKeyId(savedAccessKeyId);
      setSecretAccessKey(savedSecretAccessKey);
      setEndpoint(savedEndpoint);
      setRegion(savedRegion);
    }
  }, [open]);

  // Update the SettingsDialog to validate credentials before saving
  const handleSave = async () => {
    if (!accountId || !apiToken) {
      toast.error("Error", {
        description: "Account ID and API Token are required",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Test the credentials by making a request to our proxy API
      const testResponse = await fetch(`/api/cloudflare/buckets?per_page=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-cf-account-id": accountId,
          "x-cf-api-token": apiToken,
        },
      });

      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        throw new Error(errorData.error || "Invalid credentials");
      }

      // Save credentials to localStorage
      localStorage.setItem("cloudflare_account_id", accountId);
      localStorage.setItem("cloudflare_api_token", apiToken);
      localStorage.setItem("cloudflare_access_key_id", accessKeyId);
      localStorage.setItem("cloudflare_secret_access_key", secretAccessKey);
      localStorage.setItem(
        "cloudflare_r2_endpoint",
        endpoint || `https://${accountId}.r2.cloudflarestorage.com`
      );
      localStorage.setItem("cloudflare_region", region);

      toast.success("Success!", {
        description: "Your Cloudflare settings have been saved successfully",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to validate credentials",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cloudflare Settings</DialogTitle>
          <DialogDescription>
            Configure your Cloudflare R2 API settings
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="account-id">Cloudflare Account ID</Label>
            <Input
              id="account-id"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="a1b2c3d4e5f6g7h8i9j0"
            />
            <p className="text-xs text-muted-foreground">
              Your Cloudflare Account ID can be found in the Cloudflare
              dashboard
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-token">Cloudflare API Token</Label>
            <div className="flex space-x-2">
              <Input
                id="api-token"
                type={apiTokenVisible ? "text" : "password"}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Enter your API token"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApiTokenVisible(!apiTokenVisible)}
              >
                {apiTokenVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API token needs the following permissions: Account.R2
              Storage: Edit
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-key-id">R2 Access Key ID</Label>
            <Input
              id="access-key-id"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              placeholder="Enter your R2 Access Key ID"
            />
            <p className="text-xs text-muted-foreground">
              Create R2 API tokens in the Cloudflare dashboard under R2 → Manage
              R2 API Tokens
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret-access-key">R2 Secret Access Key</Label>
            <div className="flex space-x-2">
              <Input
                id="secret-access-key"
                type={secretKeyVisible ? "text" : "password"}
                value={secretAccessKey}
                onChange={(e) => setSecretAccessKey(e.target.value)}
                placeholder="Enter your R2 Secret Access Key"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSecretKeyVisible(!secretKeyVisible)}
              >
                {secretKeyVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endpoint">R2 Endpoint (Optional)</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder={`https://${
                accountId || "your-account-id"
              }.r2.cloudflarestorage.com`}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use the default endpoint based on your Account ID
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-region">Default Region</Label>
            <select
              id="default-region"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="auto">Auto (Recommended)</option>
              <option value="wnam">Western North America</option>
              <option value="enam">Eastern North America</option>
              <option value="weur">Western Europe</option>
              <option value="eeur">Eastern Europe</option>
              <option value="apac">Asia Pacific</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
