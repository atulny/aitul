import Image from "next/image"

export const Loader = ({
  msg = ""
}: {
  msg?: string,
}) => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/logo1.png"
          fill
        />
      </div>
      <p className="text-sm text-muted-foreground">
        AItul is thinking...
      </p>
      <p className="text-sm text-muted-foreground">
        {msg||""}
      </p>
    </div>
  );
};
