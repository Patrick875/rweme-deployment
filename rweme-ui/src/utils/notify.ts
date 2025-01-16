import { notification, NotificationPlacement } from "ant-design-vue";

export const notify = (type: "success" | "error", title: string, description: string, placement: NotificationPlacement = "topRight") => {
	notification[type]({
		message: title,
		description,
		placement,
		duration: 3,
	});
};
