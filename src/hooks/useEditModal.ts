import { useState } from 'react';

interface EditModalProps {
	isOpen?: boolean;
	questionText?: string;
	type?: string;
	constraints?: {
		required?: boolean;
		minLength?: number;
		maxLength?: number;
		pattern?: string;
		min?: number;
		max?: number;
		step?: number;
	};
}

export default function useEditModal(editData: EditModalProps | null) {
	const [questionText, setQuestionText] = useState(editData?.questionText || '');
	const [selectedType, setSelectedType] = useState(editData?.type || '');
	const [constraints, setConstraints] = useState<EditModalProps['constraints']>(
		editData?.constraints || {
			required: false,
			minLength: 0,
			maxLength: 0,
			pattern: '',
			min: 0,
			max: 0,
			step: 0,
		}
	);

	const groups = [
		{
			label: 'Text Inputs',
			items: [
				{
					label: 'Short Text',
					value: 'text',
					compatible: ['required', 'pattern', 'minLength', 'maxLength'],
				},
				{
					label: 'Long Text (Textarea)',
					value: 'textarea',
					compatible: ['required', 'pattern', 'minLength', 'maxLength'],
				},
				{
					label: 'Email',
					value: 'email',
					compatible: ['required', 'pattern', 'minLength', 'maxLength'],
				},
				{
					label: 'Password',
					value: 'password',
					compatible: ['required', 'pattern', 'minLength', 'maxLength'],
				},
				{ label: 'Number', value: 'number', compatible: ['required', 'min', 'max', 'step'] },
			],
		},
		{
			label: 'Date & Time',
			items: [
				{ label: 'Date Picker', value: 'date', compatible: ['required'] },
				{ label: 'Time Picker', value: 'time', compatible: ['required'] },
				{ label: 'Date & Time Picker', value: 'datetime', compatible: ['required'] },
			],
		},
		{
			label: 'Choice Inputs',
			items: [
				{ label: 'Dropdown (Single Choice)', value: 'select', compatible: ['required'] },
				{
					label: 'Dropdown (Multiple Choice)',
					value: 'multi-select',
					compatible: ['required'],
				},
				{ label: 'Radio Buttons', value: 'radio', compatible: ['required'] },
				{ label: 'Checkbox', value: 'checkbox', compatible: [] },
				{ label: 'Toggle / Switch', value: 'toggle', compatible: [] },
			],
		},
		{
			label: 'File Uploads',
			items: [
				{ label: 'File Upload', value: 'file', compatible: ['required'] },
				{ label: 'Image Upload', value: 'image', compatible: ['required'] },
				{ label: 'Signature Pad', value: 'signature', compatible: ['required'] },
			],
		},
		{
			label: 'Special Inputs',
			items: [
				{
					label: 'Range Slider',
					value: 'range',
					compatible: ['required', 'min', 'max', 'step'],
				},
				{ label: 'Rating', value: 'rating', compatible: ['required', 'min', 'max'] },
				{ label: 'Color Picker', value: 'color', compatible: ['required'] },
			],
		},
	];

	const compatible = groups.flatMap((g) => g.items).find((i) => i.value === selectedType)?.compatible || [];

	const resetAll = () => {
		setQuestionText('');
		setSelectedType('');
		setConstraints({
			required: false,
			minLength: 0,
			maxLength: 0,
			pattern: '',
			min: 0,
			max: 0,
			step: 0,
		});
	};

	return {
		groups,
		selectedType,
		setSelectedType,
		constraints,
		setConstraints,
		compatible,
		questionText,
		setQuestionText,
		resetAll,
	};
}
