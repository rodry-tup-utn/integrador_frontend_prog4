import { Modal } from "@mantine/core";

interface ProductsModalProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

const ProductsModal = ({ open, handleClose, children }: ProductsModalProps) => {
  return (
    <Modal opened={open} size="xl" onClose={handleClose}>
      {children}
    </Modal>
  );
};

export default ProductsModal;
