import { Button } from "@/components/ui";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[550px] ng-white p-10">
        FORM
        <hr />
        <div className="flex gap-2">
          <Button
            className="gap-2 h-12 flex-1"
            variant={"outline"}
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
            variant={"outline"}
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
      </DialogContent>
    </Dialog>
  );
};
