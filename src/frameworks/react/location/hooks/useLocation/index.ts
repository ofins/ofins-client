import { Location } from "../../../../../core/location";

export const useLocation = () => {
  const { pull } = new Location();

  return {
    pull,
  };
};
