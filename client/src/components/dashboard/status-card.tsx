import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  children?: ReactNode;
  footerLink?: {
    text: string;
    href: string;
  };
}

export default function StatusCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  children,
  footerLink,
}: StatusCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <div className={`${iconColor} text-xl`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-bold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
      {footerLink && (
        <CardFooter className="bg-gray-50 px-4 py-3 text-right">
          <a
            href={footerLink.href}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            {footerLink.text} →
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
