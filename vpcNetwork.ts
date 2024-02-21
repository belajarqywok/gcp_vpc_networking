import { Input, Config } from '@pulumi/pulumi'
import { Network } from '@pulumi/gcp/compute/network'

/* Pulumi Config */
let gcpConfig = new Config('gcp')

/**
 * 	VpcNetworkStruct
 */
export interface VpcNetworkStruct {
	name:        string
	description: Input<string>
}

/**
 * 	VPC Network
 * 	@param struct VpcNetworkStruct
 * 	@return Network (@pulumi/gcp/compute/network)
 */
export const VpcNetwork = (struct: VpcNetworkStruct): Network => {
	return new Network(struct.name, {
		description: struct.description,
		autoCreateSubnetworks: false,
		deleteDefaultRoutesOnCreate: false,
		mtu: 1460,
		networkFirewallPolicyEnforcementOrder: 'AFTER_CLASSIC_FIREWALL',
		routingMode: 'REGIONAL',
		project: gcpConfig.require('project')
	})
}
