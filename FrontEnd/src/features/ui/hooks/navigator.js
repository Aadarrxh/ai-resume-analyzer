import { useNavigate } from "react-router-dom";

export default function useAppNavigate() {
  const navigate = useNavigate();

  const goTo = (route = "/") => {
    navigate(route);
  };

  return goTo;
}