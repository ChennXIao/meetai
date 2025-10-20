import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface GenerateAvatarProps {
    seed: string;
    variant?: "botttsNeutral" | "initials";
    size?: number;
}

export const generateAvatarUri = ({ seed, variant = "botttsNeutral", size = 100 }: GenerateAvatarProps) => {
    const avatar = createAvatar(
        variant === "botttsNeutral" ? botttsNeutral : initials,
        {
            seed,
            size,
        }
    );

    return avatar.toDataUri();
}