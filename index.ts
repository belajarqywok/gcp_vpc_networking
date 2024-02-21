import { Network } from '@pulumi/gcp/compute/network'

import { VpcSubnet, VpcSubnetStruct } from "./vpcSubnet"
import { VpcNetwork, VpcNetworkStruct } from "./vpcNetwork"
import { VpcFirewall, VpcFirewallStruct } from './vpcFirewall'

/**
 *  Create VPC Network
 */
const vpcNetworkStruct: VpcNetworkStruct = {
    name: 'backend-vpc-net',
    description: 'VPC Network'
}

const vpcNetwork: Network = VpcNetwork(vpcNetworkStruct)

/**
 *  Create VPC Subnetwork
 */
const vpcSubnetStructs: VpcSubnetStruct[] = [
    // asia-southeast2 (jakarta) subnetwork
    {
        name:                  'backend-vpc-subnet-jkt-0',
        description:           'VPC Subnetwork (jakarta)',
        ipCidrRange:           '10.0.0.0/24', // 254 hosts
        network:               vpcNetwork.id,
        region:                'asia-southeast2',
        purpose:               'PRIVATE_RFC_1918',
        privateIpGoogleAccess: true,
        stackType:             'IPV4_ONLY',
        secondaryIpRanges:     [{
            rangeName: 'backend-vpc-subnet-jkt-1',
            ipCidrRange: '11.0.0.0/26' // 62 hosts
        }]
    },

    // asia-southeast1 (singapore) subnetwork
    {
        name:                  'backend-vpc-subnet-sg-0',
        description:           'VPC Subnetwork (singapore)',
        ipCidrRange:           '10.0.1.0/24', // 254 hosts
        network:               vpcNetwork.id,
        region:                'asia-southeast1',
        purpose:               'PRIVATE_RFC_1918',
        privateIpGoogleAccess: true,
        stackType:             'IPV4_ONLY',
        secondaryIpRanges:     [{
            rangeName: 'backend-vpc-subnet-sg-1',
            ipCidrRange: '11.0.1.0/26' // 62 hosts
        }]
    }
]

vpcSubnetStructs.forEach(
    vpcSubnetStruct => VpcSubnet(vpcSubnetStruct)
)

/**
 *  Create VPC Firewall
 */
const vpcFirewallStructs: VpcFirewallStruct[] = [
    // Firewall Allow HTTP & HTTPS
    {
        name: 'backend-vpc-fw-allow-http-https-ingress',
        description: 'Firewall Allow HTTP & HTTPS',
        network: vpcNetwork.name,
        priority: 65534,
        direction: 'INGRESS',
        sourceRanges: [ '0.0.0.0/0' ],
        destinationRanges: [
            // asia-southeast2 (Jakarta)
            '10.0.0.0/24', '11.0.1.0/26',

            // asia-southeast1 (Singapore)
            '10.0.1.0/24', '11.0.1.0/26',
        ],
        allows: [
            {
                protocol: 'tcp',
                ports: [ '80', '443' ]
            }
        ],
        targetTags: [ 'backend-svc-idn', 'backend-svc-sg' ],
    },

    // Firewall Allow SSH Internal (INGRESS)
    {
        name: 'backend-vpc-fw-allow-ssh-internal-ingress',
        description: 'Firewall Allow HTTP & HTTPS',
        network: vpcNetwork.name,
        priority: 65534,
        direction: 'INGRESS',
        sourceRanges: [ 
            // asia-southeast2 (Jakarta)
            '10.0.0.0/24', '11.0.1.0/26',
        ],
        destinationRanges: [ 
            // asia-southeast1 (Singapore)
            '10.0.1.0/24', '11.0.1.0/26',
        ],
        allows: [
            {
                protocol: 'tcp',
                ports: [ '22' ]
            }
        ],
        targetTags: [ 'backend-svc-idn', 'backend-svc-sg' ],
    },

    // Firewall Allow SSH Internal (EGRESS)
    {
        name: 'backend-vpc-fw-allow-ssh-internal-egress',
        description: 'Firewall Allow HTTP & HTTPS',
        network: vpcNetwork.name,
        priority: 65534,
        direction: 'EGRESS',
        sourceRanges: [
            // asia-southeast1 (Singapore)
            '10.0.1.0/24', '11.0.1.0/26',
        ],
        destinationRanges: [ 
            // asia-southeast2 (Jakarta)
            '10.0.0.0/24', '11.0.1.0/26',
        ],
        allows: [
            {
                protocol: 'tcp',
                ports: [ '22' ]
            }
        ],
        targetTags: [ 'backend-svc-idn', 'backend-svc-sg' ],
    },

    // Firewall Allow SSH External (INGRESS)
    {
        name: 'backend-vpc-fw-allow-ssh-external-ingress',
        description: 'Firewall Allow HTTP & HTTPS',
        network: vpcNetwork.name,
        priority: 65534,
        direction: 'INGRESS',
        sourceRanges: [ 
            '0.0.0.0/0'
        ],
        destinationRanges: [ 
            // asia-southeast2 (Jakarta)
            '10.0.0.0/24', '11.0.1.0/26',
        ],
        allows: [
            {
                protocol: 'tcp',
                ports: [ '22' ]
            }
        ],
        targetTags: [ 'backend-svc-idn' ],
    }
]

vpcFirewallStructs.forEach(
    vpcFirewallStruct => VpcFirewall(vpcFirewallStruct)
)
