import "@app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { EThemeMode, ThemeProvider, useTheme } from "@modules/theme";
import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // enable background change to theme change
      const {
        globals: { backgrounds },
      } = context;
      const backgroundMode =
        backgrounds?.value === "#333333" ? EThemeMode.Dark : EThemeMode.Light;

      const { setMode } = useTheme();

      useEffect(() => {
        setMode(backgroundMode);
      }, [backgroundMode]);

      return <Story />;
    },
    (Story) => {
      // global providers
      return (
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </ClerkProvider>
      );
    },
  ],
};

export default preview;