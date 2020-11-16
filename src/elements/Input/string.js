const nameParam = {
  currentPassword: `現在のパスワード（必須）`,
  postalCode: `郵便番号`,
  newPassword: `新パスワード`,
  phoneNumber: `電話番号（必須）`
}

const string = {
  email: (name) => null,
  invalidEmail: (name) => '正しいメールアドレスを入力してください。 ',
  datePlaceHolder: '日を選択してください。',
  cancelBtn: 'キャンセル',
  confirmBtn: '確認',
  bothEmpty: 'メモのタイトル及び内容を入力してください。',
  limitTitle: 'メモのタイトルは20文字以内で入力してください。',
  limitContent: 'メモの内容は255文字以内で入力してください。',
  required: (name) => {
    switch (name) {
      case `Email`:
        return `正しいメールアドレスを入力してください。`;

      case `Phone`:
        return `Số điện thoại không chính xác`;

      case `Password`:
        return `Mật khẩu trống`;

      case `equipment_id`:
        return `器具名を入力してください。`

      case `serial_number`:
        return `型番を入力してください。`;

      case `manufacturer_name`:
        return `製造社名を入力してください。`;

      case `token`:
        return `パスコードを入力してください。`;

      case nameParam.currentPassword:
        return `${name}を入力してください。`;

      case `calibration_date`:
        return `校正年月日を入力してください。`;

      case `Name`:
        return `お名前を入力してください。`;

      case `Company Name`:
        return `会社名は、必ず指定してください。`;

      default:
        return `${name}を入力してください。`;
    }
  },
  max: (length) => (name) => {
    switch (name) {
      case `Password`:
        return `英数字を含めた4文字以上16文字以下のパスワードを入力してください。`;
      case `Phone`:
        return `Số điện thoại không chính xác`;
      case `Company Name`:
        return `50文字以上の名前を入力してください。`;
      default:
        return `${name} ${length} 文字以上の名前を入力してください。`;
    }
  },

  min: (length) => (name) => {
    switch (name) {
      case `Name`:
        return `2文字以上の名前を入力してください。`;
      case `Company Name`:
        return `1文字以上の名前を入力してください。`;
      case `Phone`:
        return `Số điện thoại không chính xác`;

      case `Password`:
        return `英数字を含めた4文字以上16文字以下のパスワードを入力してください。`;

      // new password
      case nameParam.newPassword:
        return `英数字を含めた4文字以上16文字以下のパスワードを入力してください。`;

      //postal code
      case nameParam.postalCode:
        return `無効な郵便番号です。`;

      //phone number
      case nameParam.phoneNumber:
        return `10-11桁の電話番号をハイフン(-)抜きで入力してください。`;

      default:
        return `${name} ${length} 文字以上の名前を入力してください。`;
    }
  },
  isNumber: (name) => {
    switch (name) {
      // postal code
      case nameParam.postalCode:
        return null;

      default:
        return `${name} 7桁の郵便番号をハイフン抜きで入力してください。`;
    }

  },
  isPast: (name) => {
    return `校正年月日を正しく入力してください。`;
  },
  passwordNotMatch: 'パスワードが間違っています。',
  default: (text) => () => text,
  alert: '注意'
}

export default string;

