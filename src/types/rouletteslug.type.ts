export interface RouletteSlugResponse {
  status: number;
  message: string;
  data: SlugData;
}

export interface SlugData {
  slug: string;
  favicon: string;
  title: string;
  customization: Customization;
}

export interface Customization {
  title: string;
  colorTitle: string;
  description: string;
  colorDescription: string;
  backgroundImage: string;
  logoImage: string;
  backgroundColor: string;
  roulette: Roulette;
  spinButton: SpinButton;
}

export interface Roulette {
  options: Option[];
}

export interface Option {
  text: string;
  background: string;
  percentage: number;
  confirmationDialog: ConfirmationDialog;
}

export interface ConfirmationDialog {
  title: string;
  titleColor: string;
  subtitle: string;
  subtitleColor: string;
  textColor: string;
  description: string;
  descriptionColor: string;
  buttonText: string;
  buttonTextColor: string;
  buttonBackground: string;
  backgroundColor: string;
  backgroundImage: string;
  linkTo: string;
}

export interface SpinButton {
  textColor: string;
  background: string;
  text: string;
}
