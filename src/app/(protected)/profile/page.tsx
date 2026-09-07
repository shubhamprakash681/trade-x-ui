"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, KeyRound, Trash2, UserRound } from "lucide-react";
import { AxiosError } from "axios";
import { authApi } from "@/api/auth.api";
import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { useToast } from "@/components/atoms/toast";
import { useAuthStore } from "@/store/auth.store";
import { formatDate } from "@/lib/utils";

function errorMessage(exception: unknown, fallback: string): string {
  return exception instanceof AxiosError ? exception.response?.data?.message || fallback : fallback;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currPasswordError, setCurrPasswordError] = useState<string>();
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();

  if (!user) return null;

  async function updateProfile(event: FormEvent) {
    event.preventDefault();
    const name = fullName.trim();
    if (name.length < 2 || name.length > 120) {
      toast("error", "Profile could not be saved", "Your name must contain 2 to 120 characters.");
      return;
    }
    setProfileLoading(true);
    try {
      const updatedUser = await authApi.updateProfile({ fullName: name });
      setUser(updatedUser);
      toast("success", "Profile updated");
    } catch (exception) {
      toast("error", "Profile could not be saved", errorMessage(exception, "Please try again."));
    } finally {
      setProfileLoading(false);
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("error", "Avatar upload failed", "Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("error", "Avatar upload failed", "The image must be 5 MB or smaller.");
      return;
    }
    setAvatarLoading(true);
    try {
      const updatedUser = await authApi.uploadAvatar(file);
      setUser(updatedUser);
      toast("success", "Avatar updated");
    } catch (exception) {
      toast("error", "Avatar upload failed", errorMessage(exception, "Please try again."));
    } finally {
      setAvatarLoading(false);
    }
  }

  async function removeAvatar() {
    setAvatarLoading(true);
    try {
      const updatedUser = await authApi.deleteAvatar();
      setUser(updatedUser);
      toast("success", "Avatar removed");
    } catch (exception) {
      toast("error", "Avatar could not be removed", errorMessage(exception, "Please try again."));
    } finally {
      setAvatarLoading(false);
    }
  }

  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    if (!currentPassword) {
      setCurrPasswordError("Enter your current password.");
      return;
    }
    if (!newPassword) {
      setNewPasswordError("Enter your new password.");
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm your new password.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 80) {
      setNewPasswordError("Your new password must contain 8 to 80 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("The new passwords do not match.");
      return;
    }
    setCurrPasswordError(undefined);
    setNewPasswordError(undefined);
    setConfirmPasswordError(undefined);

    setPasswordLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast("success", "Password updated", "Use your new password the next time you sign in.");
    } catch (exception) {
      toast(
        "error",
        "Password could not be updated",
        errorMessage(exception, "Check your current password and try again."),
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
        <p className="mt-1 text-text-secondary">Manage your TradeX account details and security.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar src={user.avatarUrl} name={user.fullName} size="lg" className="h-20 w-20 text-xl" />
          <div className="flex flex-wrap gap-2">
            <input ref={fileInputRef} className="sr-only" type="file" accept="image/*" onChange={uploadAvatar} />
            <Button loading={avatarLoading} onClick={() => fileInputRef.current?.click()} variant="secondary">
              <Camera className="h-4 w-4" />
              Upload photo
            </Button>
            {user.avatarUrl && (
              <Button loading={avatarLoading} onClick={removeAvatar} variant="ghost">
                <Trash2 className="h-4 w-4 text-loss" />
                Remove
              </Button>
            )}
            <p className="basis-full text-xs text-text-tertiary">Image files only, up to 5 MB.</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={updateProfile}>
            <Input
              id="profile-name"
              label="Full name"
              maxLength={120}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              icon={<UserRound className="h-4 w-4" />}
            />
            <Input id="profile-email" label="Email" type="email" value={user.email} disabled />
            <p className="text-xs text-text-tertiary">Member since {formatDate(user.createdAt)}</p>
            <Button type="submit" loading={profileLoading}>
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={updatePassword} noValidate>
            <Input
              id="current-password"
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              error={currPasswordError}
            />
            <Input
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={newPasswordError}
            />
            <Input
              id="confirm-password"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={confirmPasswordError}
            />
            <Button type="submit" loading={passwordLoading}>
              <KeyRound className="h-4 w-4" />
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
