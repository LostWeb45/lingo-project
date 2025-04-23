import { Button } from "@/components/ui";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import React from "react";
import { LoginForm } from "./forms/login-form";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = React.useState<"login" | "register">("login");

  const onSwithType = () => {
    setType(type == "login" ? "register" : "login");
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[550px] ng-white p-10">
        {type == "login" ? (
          <LoginForm onClose={handleClose} />
        ) : (
          <p>Регистраци</p>
        )}
        FORM
        <hr />
        <div className="flex gap-2">
          <Button
            className="gap-2 h-12 flex-1"
            variant={"ghost"}
            onClick={() =>
              signIn("yandex", {
                callbackUrl: "/",
                redirect: true,
              })
            }
          >
            <img
              src="./images/Yandex_icon.svg"
              className="w-[35px] h-[35px]"
              alt="yandex"
            />
          </Button>
          <Button
            className="gap-2 h-12 flex-1"
            variant={"ghost"}
            onClick={() =>
              signIn("vk", {
                callbackUrl: "http://localhost:3000",
                redirect: true,
              })
            }
          >
            <img src="./images/vk.svg" alt="vk" className="w-[30px] h-[30px]" />
          </Button>
        </div>
        <Button
          variant={"outline"}
          onClick={onSwithType}
          type="button"
          className="h-12"
        >
          <p className="text-[#667198]">
            {type !== "login" ? "Войти" : "Регистрация"}
          </p>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
