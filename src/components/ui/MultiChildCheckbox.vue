<template>
	<check-box v-for="(option, i) in options" :key="i" :checked="value.includes(option.id)"
		@update:checked="check(option.id, $event)" :fieldId="option.name" :label="option.name" />
</template>
  
<script lang="ts">
import ChildCheckbox from "@/components/ui/ChildCheckbox.vue";

export default {
	emits: ["update:value"],
	props: {
		value: {
			type: Array,
			required: true,
		},
		options: {
			type: Array,
			required: true,
			validator: (value: any) => {
				const hasNameKey = value.every((option: any) =>
					Object.keys(option).includes("name")
				);
				const hasIdKey = value.every((option: any) =>
					Object.keys(option).includes("id")
				);
				return hasNameKey && hasIdKey;
			},
		},
	},
	setup(props, context) {
		const check = (optionId: any, checked: any) => {
			let updatedValue = [...props.value];
			if (checked) {
				updatedValue.push(optionId);
			} else {
				updatedValue.splice(updatedValue.indexOf(optionId), 1);
			}
			context.emit("update:value", updatedValue);
		};

		return {
			check,
		};
	},
	components: {
		"check-box": ChildCheckbox,
	},
};
</script>
  