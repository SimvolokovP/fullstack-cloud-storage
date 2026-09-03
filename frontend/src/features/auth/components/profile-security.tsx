import { useState } from "react";
import { useGetMe } from "../hooks/use-get-me";
import { ProfileSettingsRow } from "./profile-settings-row";
import { LogOut, KeyRound, AtSign } from "lucide-react";
import { ConfirmLogoutDialog } from "./confirm-logout-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { ChangeEmailDialog } from "./change-email-dialog";

export function ProfileSecurity() {
  const { data: user } = useGetMe();
  const [activeModal, setActiveModal] = useState<
    "logout" | "password" | "email" | null
  >(null);

  if (!user) return null;

  const isCredentials = user.method === "CREDENTIALS";

  return (
    <section className="py-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <ProfileSettingsRow
          icon={KeyRound}
          title="Пароль"
          description={
            isCredentials
              ? "Измените пароль для входа в аккаунт"
              : "Изменение пароля недоступно для OAuth"
          }
          action="Изменить"
          disabled={!isCredentials}
          onClick={() => setActiveModal("password")}
        />

        <ProfileSettingsRow
          icon={AtSign}
          title="Email"
          description="Изменить адрес электронной почты"
          action="Изменить"
          onClick={() => setActiveModal("email")}
        />

        <ProfileSettingsRow
          icon={LogOut}
          title="Выйти из аккаунта"
          description="Завершить текущую сессию"
          action="Выйти"
          destructive
          last
          onClick={() => setActiveModal("logout")}
        />
      </div>

      <ConfirmLogoutDialog
        open={activeModal === "logout"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />

      <ChangePasswordDialog
        userId={user.id}
        open={activeModal === "password"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />

      <ChangeEmailDialog
        userId={user.id}
        open={activeModal === "email"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />
    </section>
  );
}
