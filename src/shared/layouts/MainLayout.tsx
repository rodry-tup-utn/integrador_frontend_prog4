import { Outlet } from "react-router-dom";
import { AppShell, Container, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "../../widgets/header/Header";
import Sidebar from "../../widgets/sidebar/Sidebar";
import { useAuth } from "../../features/auth/context/AuthContext";
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpened, { toggle }] = useDisclosure(false);
  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { desktop: !isAuthenticated, mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header toggle={toggle} mobileOpened={mobileOpened} />
      </AppShell.Header>
      {isAuthenticated && (
        <AppShell.Navbar p="xs">
          <Sidebar />
        </AppShell.Navbar>
      )}
      {isAuthenticated && mobileOpened && (
        <Overlay
          onClick={toggle}
          opacity={0}
          color="white"
          zIndex={300}
          hiddenFrom="sm"
        />
      )}
      <AppShell.Main bg="gray.0">
        <Container size="xl" py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
export default MainLayout;
