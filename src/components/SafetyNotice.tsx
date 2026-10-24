interface SafetyNoticeProps {
  compact?: boolean;
}

export function SafetyNotice({ compact = false }: SafetyNoticeProps) {
  return (
    <p className={`${compact ? 'text-left' : 'text-center'} text-xs leading-relaxed text-gray-500`}>
      이 서비스는 전통 명리학을 바탕으로 한 재미·성찰용 콘텐츠입니다.
      {!compact && <br />}
      {' '}의료·법률·재정·관계에 관한 중요한 결정의 근거로 사용하지 마세요.
    </p>
  );
}
