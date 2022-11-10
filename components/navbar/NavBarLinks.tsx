import React from "react";
import { AlertCircle, Car, CurrencyShekel } from "tabler-icons-react";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { MainLinkProps } from "../etc/card";
import router from "next/router";

function MainLink({
  icon,
  // color,
  label,
  href,
}: MainLinkProps) {
  return (
    // <UnstyledButton
    //   sx={(theme) => ({
    //     display: "block",
    //     width: "100%",
    //     padding: theme.spacing.xs,
    //     borderRadius: theme.radius.sm,
    //     color:
    //       theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    //     "&:hover": {
    //       backgroundColor:
    //         theme.colorScheme === "dark"
    //           ? theme.colors.dark[6]
    //           : theme.colors.gray[0],
    //     },
    //   })}
    // >
    <Link href={href} passHref>
      <NavLink
        // color={color}
        component="a"
        label={label}
        icon={icon}
        active={router.pathname === href}
      />
    </Link>
  );

  {
    /* <Link href={href}>
        <a>
          <Group>
            <ThemeIcon color={color} variant="light">
              {icon}
            </ThemeIcon>
            <Text size="sm">{label}</Text>
          </Group>
        </a>
      </Link>
    </UnstyledButton> */
  }
}

const data = [
  {
    icon: <CurrencyShekel size={16} />,
    color: "teal",
    label: "Manage Expenses",
    href: "/expenses",
  },
  {
    icon: <Car size={16} />,
    color: "blue",
    label: "Garage",
    href: "/garage",
  },
  {
    icon: <AlertCircle size={16} />,
    color: "teal",
    label: "Pending Ownership",
    href: "/pendings",
  },

  // {
  //   icon: <User size={16} />,
  //   color: "violet",
  //   label: "Discussions",
  //   href: "https://github.",
  // },
  // {
  //   icon: <Database size={16} />,
  //   color: "grape",
  //   label: "Databases",
  //   href: "https://github.com/",
  // },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
