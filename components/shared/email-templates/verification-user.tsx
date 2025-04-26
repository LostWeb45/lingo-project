interface Props {
  code: string;
}

export function VerificationUserTemplate({ code }: Props) {
  return `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h1>Подтверждение почты</h1>
        <p>Ваш код подтверждения:</p>
        <h2>${code}</h2>
        <p>Если вы не запрашивали подтверждение, просто проигнорируйте это письмо.</p>
      </div>
    `;
}
