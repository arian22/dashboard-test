"use client";

import * as React from "react"
import {
  IconUserCircle,
  IconCamera,
  IconChartBar,
  IconCurrencyDollar,
  IconDiamond,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconLayoutList,
  IconFolder,
  IconFilePlus,
  IconHelp,
  IconCircleFilled,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Arian M",
    email: "arian.m@gmail.com",
    avatar: "/avatars/apple-touch-icon.png",
  },
  navMain: [
    {
      title: "دفتر روزنامه",
      url: "#",
      icon: IconReport,
    },
    {
      title: "ثبت سند",
      url: "#",
      icon: IconFilePlus,
    },
    {
      title: "نمودار قیمت ها",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "گزارش ها",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "تسک ها",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "مدیران",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "کاربران",
      url: "#",
      icon: IconUserCircle,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "تنظیمات",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "پشتیبانی",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "جستجو",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "جواهر",
      url: "#",
      icon: IconDiamond,
    },
    {
      name: "کار ساخته",
      url: "#",
      icon: IconLayoutList,
    },
    {
      name: "سکه",
      url: "#",
      icon: IconCircleFilled,
    },
    {
      name: "آبشده",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "ارز",
      url: "#",
      icon: IconCurrencyDollar,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" dir="rtl" className="text-right border-l border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">آرین مبرقعی</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
