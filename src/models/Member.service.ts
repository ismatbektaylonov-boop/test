import { MemberType } from '../libs/enums/member.enum'
import { Errors, HttpCode, Message } from '../libs/Errors'
import { MemberLoginInput, MemberSignupInput } from '../libs/types/member'
import MemberModel from '../schema/Member.model'
import AuthService from './Auth.service'

class MemberService {
	public async countMembers() {
		return MemberModel.countDocuments().exec()
	}

	public async signup(input: MemberSignupInput) {
		const existing = await MemberModel.findOne({
			memberEmail: input.memberEmail,
		}).exec()
		if (existing) {
			throw new Errors(HttpCode.BAD_REQUEST, Message.USED_MEMBER_EMAIL)
		}

		const hashed = await AuthService.hashPassword(input.memberPassword)
		const result = await MemberModel.create({
			...input,
			memberPassword: hashed,
		})
		return result
	}

	public async login(input: MemberLoginInput) {
		const member = await MemberModel.findOne({
			memberEmail: input.memberEmail,
		})
			.select('+memberPassword')
			.exec()

		if (!member) {
			throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD)
		}

		const isMatch = await AuthService.comparePassword(
			input.memberPassword,
			member.memberPassword,
		)
		if (!isMatch) {
			throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD)
		}

		return member
	}

	// Loyihani birinchi marta ishga tushirganda bitta ADMIN yaratish uchun qulay metod
	public async createAdminIfNotExists(
		email: string,
		plainPassword: string,
		name: string,
	) {
		const existing = await MemberModel.findOne({
			memberEmail: email,
		}).exec()
		if (existing) return existing

		const hashed = await AuthService.hashPassword(plainPassword)
		return MemberModel.create({
			memberName: name,
			memberEmail: email,
			memberPassword: hashed,
			memberType: MemberType.ADMIN,
		})
	}
}

export default new MemberService()
