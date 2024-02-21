import { Subnetwork } from '@pulumi/gcp/compute/subnetwork'
import { Input, Output } from "@pulumi/pulumi"

/**
 * 	Secondary Ip Range Struct
 */
export interface SecondaryIpRangeStruct {
	rangeName:   Input<string>
	ipCidrRange: Input<string>
}

/**
 * 	VPC Subnetwork Struct
 */
export interface VpcSubnetStruct {
	name:                  string
	description:           Input<string>
	network:               Output<string>
	ipCidrRange:           Input<string  | '10.0.0.0/24'>
	region:                Input<string  | 'asia-southeast2'>
	purpose:               Input<string  | 'PRIVATE_RFC_1918'>
	stackType:             Input<string  | 'IPV4_ONLY'>
	privateIpGoogleAccess: Input<boolean | true>
	secondaryIpRanges:     Input<Input<SecondaryIpRangeStruct>[]>
}

/**
 * 	VPC Subnetwork
 * 	@param struct vpcSubnetStruct
 * 	@return Subnetwork (@pulumi/gcp/compute/subnetwork)
 */
export const VpcSubnet = (struct: VpcSubnetStruct): Subnetwork => {
	return new Subnetwork(struct.name, {
    description:           struct.description,
		ipCidrRange:           struct.ipCidrRange,
		network:               struct.network,
		region:                struct.region,
		purpose:               struct.purpose,
		privateIpGoogleAccess: struct.privateIpGoogleAccess,
		stackType:             struct.stackType,
		secondaryIpRanges:     struct.secondaryIpRanges,
	})
}
