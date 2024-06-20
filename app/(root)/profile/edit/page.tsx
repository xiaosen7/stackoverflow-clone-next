import { userActions } from "@/actions";
import { prisma } from "@/prisma";
import { ProfileForm } from "@/profile";
import { PROFILE_SCHEMA } from "@/profile/constants";
import { IPageProps, IUser } from "@/shared";
import { ac } from "@/shared/utils/action";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const onSubmit = async (user: IUser, data: z.infer<typeof PROFILE_SCHEMA>) => {
  "use server";
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data,
  });

  redirect("/profile");
};

const ProfileEditPage: React.FC<IPageProps> = async () => {
  const user = await userActions.getCurrentOrRedirectSignIn();

  return <ProfileForm user={user} onSubmit={ac(onSubmit).bindArgs(user)} />;
};

export default ProfileEditPage;
