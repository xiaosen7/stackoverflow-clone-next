import Link from "next/link";
import React from "react";
import { IComponentBaseProps } from "../types";
import { mp } from "../utils";

export interface ICLinkableProps extends IComponentBaseProps {
  href?: string;
  children?: React.ReactNode;
}

export const CLinkable: React.FC<ICLinkableProps> = (props) => {
  const { href, children } = props;

  if (href) {
    return mp(
      props,
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (React.isValidElement(children)) {
    return mp(props, children);
  }

  return children;
};