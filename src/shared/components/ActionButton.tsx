import { Button, Tooltip } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

type variants =
  | "filled"
  | "light"
  | "outline"
  | "subtle"
  | "transparent"
  | "white"
  | "default";
interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
  color?: string;
  icon: Icon;
  text?: string;
  variant?: variants;
  disabled?: boolean;
}

const ActionButton = ({
  onClick,
  label,
  color = "gray",
  icon: Icon,
  text,
  variant = "light",
  disabled,
}: Props) => {
  return (
    <Tooltip label={label} color={color}>
      <Button
        color={color}
        variant={variant}
        leftSection={text ? <Icon size={16} /> : undefined}
        onClick={onClick}
        disabled={disabled}
      >
        {text || <Icon size={22} />}
      </Button>
    </Tooltip>
  );
};

export default ActionButton;
