import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useResourcesStore = defineStore(
	'resourcesStore',
	() => {
		const selectedResources = ref({});
		const selectedResourcesDetails = ref([]);

		const updateResources = (data) => {
			const { key, resources, details } = data;
			// if (!selectedResources.value.find((item) => item.key === key)) {
			selectedResources.value[key] = resources;
			selectedResourcesDetails.value = details;
			// } else {
			// 	selectedResources.value[key] = [
			// 		...selectedResources.value[key],
			// 		...data.resources,
			// 	];
			// }
		};

		return {
			selectedResources,
			selectedResourcesDetails,
			updateResources,
		};
	},
	{
		persist: true,
	}
);
