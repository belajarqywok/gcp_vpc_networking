import { Input, Output } from '@pulumi/pulumi'
import { Firewall } from '@pulumi/gcp/compute/firewall'

/**
 * 	VPC Firewall Allow and Deny Struct
 */
interface VpcAllowDenyStruct {
	protocol: Input<string>
	ports:    Input<Input<string>[]>
}

/**
 * 	VPC Firewall Struct
 */
export interface VpcFirewallStruct {
	name:              string
	description:       Input<string>
	network:           Output<string>
	priority:          Input<number | 1000>
	direction:         Input<string | 'INGRESS'>
	sourceRanges:      Input<Input<string>[]>
	destinationRanges: Input<Input<string>[]>
	allows:            Input<Input<VpcAllowDenyStruct>[]>
	targetTags:        Input<Input<string>[]>
}

/**
 * 	VPC Firewall
 * 	@param struct VpcFirewallStruct
 * 	@return Firewall (@pulumi/gcp/compute/firewall)
 */
export const VpcFirewall = (struct: VpcFirewallStruct): Firewall => {
	return new Firewall(struct.name, {
		description:       struct.description,
		network:           struct.network,
		priority:          struct.priority,
		direction:         struct.direction,
		sourceRanges:      struct.sourceRanges,
		destinationRanges: struct.destinationRanges,
		allows:            struct.allows,
		targetTags:        struct.targetTags
	})
}
