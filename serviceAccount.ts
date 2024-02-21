import { Input, Config } from '@pulumi/pulumi'
import { Account } from '@pulumi/gcp/serviceaccount/account'
import { getAccount, GetAccountResult } from '@pulumi/gcp/serviceaccount/getAccount'

/* Pulumi Config */
let gcpConfig = new Config('gcp')

/**
 * 	Create Account Struct
 */
export interface CreateAccountStruct {
	name:         string
	description:  Input<string>
	accountId:    Input<string>
	displayName:  Input<string>
}

/**
 * 	Get Service Account	
 * 
 * 	@param id string
 * 	@return GetAccountResult (@pulumi/gcp/serviceaccount/getAccount)
 */
export const GetAccount = (id: string): Promise<GetAccountResult> => {
	return getAccount({
		accountId: id,
		project:   gcpConfig.require('project')
	})
}

/**
 * 	Create Service Account
 * 
 * 	@param struct CreateAccountStruct
 * 	@return Account (@pulumi/gcp/serviceaccount/account)
 */
export const CreateAccount = (struct: CreateAccountStruct): Account => {
	return new Account(struct.name, {
		description:  struct.description,
		accountId:    struct.accountId,
		displayName:  struct.displayName,
		project:      gcpConfig.require('project')
	})
}
