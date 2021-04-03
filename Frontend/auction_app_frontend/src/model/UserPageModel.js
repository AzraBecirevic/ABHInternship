import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

class UserPageModel {
  UserPageTabs = [
    {
      id: 1,
      tabName: "Profile",
      tabMenuName: "Profile",
    },
    {
      id: 2,
      tabName: "Seller",
      tabMenuName: "Become Seller",
    },
    { id: 3, tabName: "Bids", tabMenuName: "Your Bids" },
    {
      id: 4,
      tabName: "Settings",
      tabMenuName: "Settings",
    },
  ];
}

export default UserPageModel;
