export const LoaderIcon = () => (
  <svg
    width={100}
    height={50}
    viewBox="0 0 100 50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x={17.5} y={22.5} width={5} height={5} fill="white">
      <animate
        attributeName="y"
        values="22.5;7.5;22.5"
        dur="1s"
        repeatCount="indefinite"
      />
    </rect>
    <rect x={47.5} y={22.5} width={5} height={5} fill="white">
      <animate
        attributeName="y"
        values="22.5;7.5;22.5"
        dur="1s"
        repeatCount="indefinite"
        begin="0.3s"
      />
    </rect>
    <rect x={77.5} y={22.5} width={5} height={5} fill="white">
      <animate
        attributeName="y"
        values="22.5;7.5;22.5"
        dur="1s"
        repeatCount="indefinite"
        begin="0.6s"
      />
    </rect>
  </svg>
);
