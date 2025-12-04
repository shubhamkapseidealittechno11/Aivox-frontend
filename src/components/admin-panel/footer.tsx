import Link from "next/link";
import moment from 'moment';

export function Footer() {
  const currentYear = moment().format('YYYY');
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-[]">
      <div className="mx-4 md:mx-8 flex h-10 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
        © {currentYear}, Retell AI

        </p>
      </div>
    </div>
  );
}
