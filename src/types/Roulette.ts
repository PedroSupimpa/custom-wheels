export interface RouletteListData {
  name: string;
  url: string;
  createdAt: string;
  prizeList: string[];
}

export interface RouletteForm1 {
  title: string;
  favicon: string;
  slug: string;
}

export interface RouletteForm2 {
  title: string;
  colorTitle: string;
  description: string;
  colorDescription: string;
  backgroundImage: string;
  logoImage: string;
  backgroundColor: string;
  roulette: {
    options: PrizeOption[];
  };
  spinButton:{
    textColor: string
    background: string
    text: string
  }
}

export interface PrizeOption {
  text: string;
  percentage: number;
  background: string;
  confirmationDialog: RouletteConfirmationDialog;
}

export interface RouletteConfirmationDialog {
  title: string;
  titleColor: string;
  subtitle: string;
  subtitleColor: string;
  description: string;
  descriptionColor: string;
  buttonText: string;
  buttonTextColor: string;
  buttonBackground: string;
  backgroundColor: string;
  backgroundImage: string;
  linkTo: string;
}

export interface RouletteData {
  title: string;
  slug: string;
  favicon: string;
  description: string;
  backgroundImage: string;
  logoImage: string;
  backgroundColor: string;
  titleColor: string;
  prizeOptions: PrizeOption[];
}
export interface WinnerOption {
  winnerNumber: string;
  option: string;
}
