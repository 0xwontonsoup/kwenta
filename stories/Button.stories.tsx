import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../components/Button';
import PositionButtons from 'sections/futures/PositionButtons';
import { PositionSide } from 'queries/futures/types';

export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		backgroundColor: { control: 'color' },
	},
	decorators: [
		(Story) => (
			<div style={{ width: 334 }}>
				<Story />
			</div>
		),
	],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Small = Template.bind({});

Small.args = {
	size: 'sm',
	children: 'Button',
};

export const Medium = Template.bind({});

Medium.args = {
	size: 'md',
	children: 'Button',
	style: { width: '157px' },
};

export const Danger = Template.bind({});

Danger.args = {
	size: 'md',
	children: 'Button',
	variant: 'danger',
	fullWidth: true,
	style: { width: '157px' },
};

export const Disabled = Template.bind({});

Disabled.args = {
	size: 'md',
	children: 'Button',
	style: { width: '157px' },
	disabled: true,
};

export const Primary = Template.bind({});

Primary.args = {
	size: 'md',
	children: 'Button',
	variant: 'primary',
};

export const Secondary = Template.bind({});

Secondary.args = {
	size: 'md',
	children: 'Button',
	variant: 'secondary',
};

export const Monospace = Template.bind({});

Monospace.args = {
	size: 'sm',
	children: '10x',
	mono: true,
};

export const Position = () => {
	const [selected, setSelected] = React.useState<PositionSide>(PositionSide.LONG);

	return <PositionButtons selected={selected} setSelected={setSelected} />;
};
