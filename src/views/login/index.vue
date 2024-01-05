<template>
	<div class="login-wrapper">
		<div class="login-form-container">
			<div class="login-form-left" ref="loginFormLeft">
				<img class="logo-box" width="52" height="52" :src="logoUrl" />
				<span class="title-font">{{ title }}</span>
			</div>
			<div class="login-form-right">
				<div class="table">
					<el-form
						autoComplete="off"
						:model="loginForm"
						:rules="loginRules"
						ref="loginFormRef"
						label-position="left"
						label-width="0px"
						class="card-box login-form"
					>
						<h3 class="title">欢迎登录</h3>
						<el-form-item prop="userName" :class="activeClass === 1 ? 'has-border-active' : 'has-border'">
							<span class="svg-container">
								<i class="iconfont iconuser"></i>
							</span>
							<el-input
								name="userName"
								v-model.trim="loginForm.userName"
								placeholder="用户"
								@focus="handleActive(1)"
								@input="userNameInput"
								clearable
							/>
						</el-form-item>
						<el-form-item prop="password" :class="activeClass === 2 ? 'has-border-active' : 'has-border'">
							<span class="svg-container">
								<!--<svg-icon icon-class="locked"></svg-icon>-->
								<i class="iconfont iconlocked"></i>
							</span>
							<el-input
								name="password"
								type="password"
								@keyup.enter="handleLogin(loginFormRef)"
								@focus="handleActive(2)"
								v-model.trim="loginForm.password"
								autoComplete="new-password"
								placeholder="密码"
								clearable
								:show-password="Boolean(loginForm.password)"
								@input="userPwdInput"
							/>
						</el-form-item>
						<el-form-item class="login-btn">
							<el-button
								type="warning"
								style="width: 100%"
								:loading="loading"
								@click.prevent="handleLogin(loginFormRef)"
							>
								{{ loading ? '登录中' : '登录' }}
							</el-button>
						</el-form-item>
						<el-form-item>
							<el-col :span="12">
								<!-- <el-checkbox v-model="checkedUserName" class="checked-box">记住用户名</el-checkbox> -->
							</el-col>
						</el-form-item>
					</el-form>
					<div class="login-prompt">
						<div>
							为提高用户体验，建议使用
							<a href="https://kcwl-third.oss-cn-beijing.aliyuncs.com/exe/ChromeSetup.exe"
								><img src="../../assets/imgs/browser/chrome.jpg" />Chrome浏览器</a
							>或<a href="https://kcwl-third.oss-cn-beijing.aliyuncs.com/exe/Firefox-setup.exe"
								><img src="../../assets/imgs/browser/firefox.jpg" />火狐浏览器</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="footer">
			{{ copyright }}
		</div>
		<Verify
			@verify-success="onSuccess"
			:mode="'pop'"
			captchaType="blockPuzzle"
			:imgSize="{ width: '330px', height: '155px' }"
			ref="verifyRef"
		/>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'

import { userApi } from '@/api'
import { uname, password } from '@/utils/crypto'
import Verify from '@/components/verifition/Verify.vue'

import logoImg from '@/assets/imgs/login/logo.png'

// data
const loginForm = reactive({
	userName: '',
	password: '',
	key: '',
	captcha: '',
	checked: false,
})
let logoUrl = ref('')
let title = ref('建龙物流管理平台')
let copyright = ref('')

const loginFormRef = ref()
const verifyRef = ref()

const validatUserName = (rule: any, value: any, callback: any) => {
	console.log(rule, 'ruless==')
	if (value === '') {
		callback(new Error('请输入用户名'))
	} else {
		callback()
	}
}
const validatePass = (rule: any, value: any, callback: any) => {
	console.log(rule, 'ruless==a a a a')
	if (value === '') {
		callback(new Error('请输入密码'))
	} else {
		callback()
	}
}
const loginRules = reactive({
	userName: [{ required: true, trigger: 'blur', validator: validatUserName }],
	password: [{ required: true, trigger: 'blur', validator: validatePass }],
})
let activeClass = ref(1)
let loading = ref(false)
let captchaId = ref(0)
let favicon = ref(null)

// 拿到路由
const router = useRouter()

// 拿到userStore
const userStore = store.useUserStore()

// 生命周期
onBeforeMount(() => {
	getCrmAppInfo()
})

/* methods */
const getCrmAppInfo = async () => {
	const res = await userApi.getCrmAppInfo()
	const { data, code } = res.data || {}
	if (code === 0) {
		copyright.value = data.copyright
		logoUrl.value = data.logo || logoImg
		favicon.value = data.ico
		// 设置favicon
		changeFavicon(favicon.value)
	}
}
const changeFavicon = (url: any) => {
	// 如果没有url就使用系统默认的favicon
	if (!url) {
		return
	}
	// 能拿到地址使用传入url favicon
	let link: any = document.querySelector("link[rel*='icon']") || document.createElement('link')
	link.type = 'image/x-icon'
	link.rel = 'shortcut icon'
	link.href = url
	document.getElementsByTagName('head')[0].appendChild(link)
}
const handleLogin = async (formEl: any) => {
	if (!formEl) return
	await formEl.validate((valid: boolean) => {
		if (valid) {
			verifyRef.value.show()
		} else {
			return false
		}
	})
}

const handleActive = (num: any) => {
	activeClass.value = num
}

const userPwdInput = () => {}
const userNameInput = () => {}

const onSuccess = (params: any) => {
	// params 返回的二次验证参数
	handleCodeSuccess(params.captchaVerification)
}
// 验证通过之后调用的函数
const handleCodeSuccess = (captchaVerification: any) => {
	loading.value = true
	/*获取登录秘钥*/
	userApi.getLoginSecretKey().then((res) => {
		if (res.data.code === 0) {
			const data = res.data.data
			loginForm.key = data.substring(0, 32) //传的key
			const key = data.substring(data.length - 32) //加密key
			const iv = key.substring(0, 16) //偏移量
			const KP = {
				key: key,
				iv: iv,
			}
			let params = {
				userName: uname(KP, loginForm.userName.toLowerCase()),
				password: password(KP, loginForm.password),
				key: loginForm.key,
				captchaId: captchaId.value,
				captcha: loginForm.captcha,
				checked: loginForm.checked,
				captchaVerification,
			}

			userStore
				.login(params)
				.then(({ code }) => {
					if (code === 0) {
						rememberUserName()
						// 登录之后跳转到首页
						router.push({ name: 'home' })
					} else if (code === 10007) {
						loading.value = false
						loginForm.captcha = ''
					} else {
						loading.value = false
						loginForm.captcha = ''
					}
				})
				.catch(() => {
					loading.value = false
				})
		}
	})
}
// 记住密码
const rememberUserName = () => {}
</script>

<style lang="scss" scoped>
@import '@/styles/_setting.scss';
$bg: #2d3a4b;
$bg_text: #e9e9e9;
$bg_text_active: #f7b62d;
$light_gray: #eee;
$dark_gray: #889aa4;
$primary: #181c61;

.login-wrapper {
	position: relative;
	height: 100%;
	width: 100%;
	background: $bg url('../../assets/imgs/login/bg.png') no-repeat center center;
	min-height: 700px;
	overflow-y: auto;
	background-size: cover;
	.login-form-container {
		height: 100%;
		/*width: 100%;*/
		padding: 50px;
		.login-form-left {
			width: 65%;
			height: 100%;
			float: left;
			background: url('../../assets/imgs/login/kcad.png') no-repeat center center;
			background-size: cover;
			position: relative;

			.title-font {
				position: absolute;
				top: 28px;
				left: 106px;
				font-size: 30px;
				color: #fff;
			}

			.logo-box {
				margin: 20px 0 0 40px;
			}

			.right-title {
				position: absolute;
				bottom: 170px;
				left: 60px;
				font-size: 54px;
				text-align: left;
				color: #fff;
			}

			.right-tip {
				position: absolute;
				bottom: 130px;
				right: 60px;
				font-size: 24px;
				text-align: left;
				color: #fff;
				font-weight: 200;
			}
		}

		.login-form-right {
			width: 35%;
			height: 100%;
			float: left;
			background: #fff;
			.table {
				display: table;
				height: 100%;
				width: 100%;
			}
		}
		.table {
			overflow: hidden;
			.login-form {
				/*position: absolute;*/
				/*left: 0;*/
				/*right: 0;*/
				/*display: table-cell;*/
				/*vertical-align: middle;*/
				width: 100%;
				/*min-width: 520px;*/
				/*float: left;*/
				padding: 0 35px;
				margin: 15% auto 0;

				.identify-box .has-border {
					border-bottom: 1px solid $bg_text;
				}

				.identify-box .has-border-active {
					.svg-icon {
						color: $bg_text_active;
					}

					border-bottom: 1px solid $bg_text_active;
				}

				.forget-pwd-item {
					float: right;
					color: #2cb7f5;
				}
			}
			.login-prompt {
				margin: 0 35px;
				font-size: $fontSizeMid;
				text-align: right;
				line-height: 35px;
				color: $primary;
				position: relative;
				div {
					position: absolute;
					right: 0;
					a {
						color: $bg_text_active;
						text-decoration: underline;
						img {
							width: 40px;
							height: 40px;
						}
					}
				}
			}
		}
		.tips {
			font-size: $fontSizeBase;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
			font-size: $fontSizeLarge;
		}

		.title {
			width: 140px;
			padding: 10px;
			font-size: 26px;
			color: #000;
			margin: 0 auto 40px auto;
			text-align: center;
			font-weight: bold;
			border-bottom: 3px solid $bg_text_active;
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: $fontSizeMid;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: calc(100% - 40px);
		height: 48px;
		font-size: $fontSizeMinimum;
		color: $bg_text;
		text-align: center;
		line-height: 48px;
	}
}
</style>
