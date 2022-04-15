import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BigNumber } from '@ethersproject/bignumber';
import cl from '../../../soupStuff';

import PnLs from './PnLs';
import ProfitDetails from './ProfitDetails';
import BaseModal from 'components/BaseModal';
import LabelWithInput from './LabelWithInput';
import PositionButtons from '../../../sections/futures/PositionButtons';
import { PositionSide } from '../types';

const scalar = 100;

type ProfitCalculatorProps = {
	// history: PositionHistory[] | null;
	// isLoading: boolean;
	// isLoaded: boolean;
};

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
	marketAsset,
	setOpenProfitCalcModal,
}: any) => {
	const { t } = useTranslation();

	/**
	 * @todo Working with BigNumbers is complicated due to underflow/overflow
	 *       errors AND because of errors when the input is a `float` type
	 */
	// BigNumbers
	const [entryPrice, setEntryPrice] = useState<BigNumber>(ethers.BigNumber.from(0));
	const [exitPrice, setExitPrice] = useState<BigNumber>(ethers.BigNumber.from(0));
	const [stopLoss, setStopLoss] = useState<BigNumber>(ethers.BigNumber.from(0));
	const [marketAssetPositionSize, setMarketAssetPositionSize] = useState<BigNumber>(
		ethers.BigNumber.from(0)
	);
	// Custom type
	const [leverageSide, setLeverageSide] = useState<PositionSide>(PositionSide.LONG);

	const handleSetInput = (_e: any, _stateVar: any, _stateVarName: string) => {
		let isNum, isFloat, isUglyFloat1, isUglyFloat2, clampDecimals;

		_stateVar = _e.currentTarget.value;
		isNum = /^\d+$/.test(_stateVar);
		isFloat = /^[0-9]+\.[0-9]+$/.test(_stateVar);
		isUglyFloat1 = /^\.[0-9]+$/.test(_stateVar);
		isUglyFloat2 = /^[0-9]+\.$/.test(_stateVar);
		clampDecimals = /^\d+\.\d{0,3}$/.test(_stateVar);

		if (isNum || isFloat || isUglyFloat1 || isUglyFloat2 || clampDecimals) {
			if (_stateVar.indexOf(' ') >= 0) {
				// if includes whitespace
				_stateVar.trim();
			}

			if (!isNaN(_stateVar) && _stateVar !== '') {
				if (_stateVarName === 'entryPrice') {
					const clampedInput = parseFloat(parseFloat(_stateVar).toPrecision(3));
					setEntryPrice(ethers.BigNumber.from(clampedInput * scalar));
					cl('entryPrice: ', entryPrice.toString());
				}
				
				if (_stateVarName === 'exitPrice') {
					const clampedInput = parseFloat(parseFloat(_stateVar).toPrecision(3));
					setExitPrice(ethers.BigNumber.from(clampedInput * scalar));
					cl('exitPrice: ', exitPrice.toString());
				}

				if (_stateVarName === 'stopLoss') {
					const clampedInput = parseFloat(parseFloat(_stateVar).toPrecision(3));
					setStopLoss(ethers.BigNumber.from(clampedInput * scalar));
					cl('stopLoss: ', stopLoss.toString());
				}

				if (_stateVarName === 'marketAssetPositionSize') {
					const clampedInput = parseFloat(parseFloat(_stateVar).toPrecision(4));
					setMarketAssetPositionSize(ethers.BigNumber.from(clampedInput * scalar));
					cl('marketAssetPositionSize: ', marketAssetPositionSize.toString());
				}
			}
		}
	};

	/**
	 * @todo Save this for last!
	 */
	const handleCalculateProfit = (e: any) => {
		e.preventDefault();
	};

	const setTargetInputValue = (source: string, target: string) => {
		let src_: HTMLElement | null | string = document.getElementById(source),
			target_: HTMLElement | null | string = document.getElementById(target);

		const scalePercentage = 100;

		if (src_ !== null && target_ !== null) {
			// Ignore VSCode saying that there's an error, `HTMLElement.value` does
			// not result in an error :p
			if (src_.value !== null && target_.value !== null) {
				if (source === 'exit-price') {
					const gainPercent_: number = parseFloat(src_.value) / entryPrice.toNumber();
					const clampedGainPercent = (gainPercent_ * scalePercentage).toPrecision(3);

					target_.value = clampedGainPercent;
				}

				if (source === 'stop-loss') {
					const lossPercent_: number = parseFloat(src_.value) / stopLoss.toNumber();
					const clampedLossPercent = (lossPercent_ * scalePercentage).toPrecision(3);

					target_.value = clampedLossPercent;
				}

				if (source === 'market-position-size') {
					const basePositionSize_: number = parseFloat(src_.value) * entryPrice.toNumber() / scalar;
					const clampedBasePositionSize = basePositionSize_.toPrecision(10);

					target_.value = clampedBasePositionSize;
				}
			}
		}
	};

	// Run this whenever `exitPrice` and `stopLoss` are updated
	useEffect(() => {
		setTargetInputValue('exit-price', 'gain-percent');
		setTargetInputValue('stop-loss', 'loss-percent');
		setTargetInputValue('market-position-size', 'base-position-size');
	}, [exitPrice, stopLoss, marketAssetPositionSize]);

	return (
		<>
			<BaseModal
				onDismiss={() => setOpenProfitCalcModal(false)}
				isOpen={true}
				/**
				 * @todo IDK how to make this comply with this project's style, e.g.
				 *       `t('modals.confirm-transaction.title')`
				 */
				title={t('Profit Calculator')}
			>
				<ModalWindow>
					<form onSubmit={handleCalculateProfit}>
						<LabelWithInput
							className={'entry-price'}
							labelText={'Entry Price: '}
							placeholder={'$43,938.11'}
							onChange={(e: any) => handleSetInput(e, entryPrice, 'entryPrice')}
						/>
						<ProfitCalcGrid>
							{/* LEFT column */}
							<LeftColumn>
								<LabelWithInput
									id={'exit-price'}
									labelText={'Exit Price: '}
									placeholder={'$46,939.11'}
									onChange={(e: any) => handleSetInput(e, exitPrice, 'exitPrice')}
								/>
								<LabelWithInput
									id={'stop-loss'}
									labelText={'Stop Loss: '}
									placeholder={'$32,000.00'}
									onChange={(e: any) => handleSetInput(e, stopLoss, 'stopLoss')}
								/>
								<LabelWithInput
									id={'market-position-size'}
									labelText={'Position Size: '}
									placeholder={`23.1 ${marketAsset}`}
									onChange={(e: any) =>
										handleSetInput(e, marketAssetPositionSize, 'marketAssetPositionSize')
									}
								/>
							</LeftColumn>
							{/* RIGHT column */}
							<RightColumn>
								<LabelWithInput id={'gain-percent'} labelText={'Gain %: '} placeholder={`5.55%`} />
								<LabelWithInput id={'loss-percent'} labelText={'Loss %: '} placeholder={`4.1%`} />
								<LabelWithInput
									id={'base-position-size'}
									labelText={'Position Size: '}
									placeholder={`$305,532.28 sUSD`}
								/>
							</RightColumn>
						</ProfitCalcGrid>
						{/* BUTTONS */}
						<PositionButtons
							selected={leverageSide}
							onSelect={setLeverageSide}
							isMarketClosed={false}
						/>
						{/* STATS row of 3 */}
						<StatsGrid>
							<PnLs
								scalar={scalar}
								entryPrice={entryPrice}
								exitPrice={exitPrice}
								stopLoss={stopLoss}
							/>
						</StatsGrid>
						{/* PROFIT DETAILS */}
						<ProfitDetails
							leverageSide={leverageSide}
							exitPrice={exitPrice}
							stopLoss={stopLoss}
							marketAssetPositionSize={marketAssetPositionSize}
							marketAsset={marketAsset}
						/>
					</form>
				</ModalWindow>
			</BaseModal>
		</>
	);
};

const StatsGrid = styled.div`
	display: grid;
	grid-gap: 1.1rem;
	grid-template-columns: repeat(3, 1fr);

	margin-top: 20px;
`;

const LeftColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: left;
	align-self: left;
`;

const RightColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: right;
	align-self: right;
`;

const ProfitCalcGrid = styled.div`
	display: grid;
	grid-gap: 1.1rem;
	grid-template-columns: repeat(2, 1fr);
`;

const ModalWindow = styled.div`
	height: 789px;
`;

export default ProfitCalculator;
