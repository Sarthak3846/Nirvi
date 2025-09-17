interface StatsCardProps {
	title: string;
	value: string | number;
	change?: string;
	changeType?: 'positive' | 'negative' | 'neutral';
	icon?: string;
}

export default function StatsCard({ title, value, change, changeType = 'neutral', icon }: StatsCardProps) {
	const changeColor = {
		positive: 'text-green-600',
		negative: 'text-red-600',
		neutral: 'text-gray-600'
	}[changeType];

	return (
		<div className="bg-white overflow-hidden shadow rounded-lg">
			<div className="p-5">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						{icon && (
							<div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
								<span className="text-white text-lg">{icon}</span>
							</div>
						)}
					</div>
					<div className="ml-5 w-0 flex-1">
						<dl>
							<dt className="text-sm font-medium text-gray-500 truncate">
								{title}
							</dt>
							<dd className="flex items-baseline">
								<div className="text-2xl font-semibold text-gray-900">
									{value}
								</div>
								{change && (
									<div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
										{change}
									</div>
								)}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
}
