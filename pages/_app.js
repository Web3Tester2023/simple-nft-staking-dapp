import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "@chakra-ui/pro-theme";
import "@fontsource/inter/variable.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const celoChain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "BNB Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Smart Chain",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed.binance.org",
  },
  blockExplorers: {
    default: {
      name: "BSC SCAN",
      url: "https://bscscan.com",
    },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [binance],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== binance.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "PunkPEPE OG NFT STAKING",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
function MyApp({ Component, pageProps }) {
  const myTheme = extendTheme(
    {
      colors: { ...theme.colors },
    },
    theme
  );

  return (
    <ChakraProvider theme={myTheme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
