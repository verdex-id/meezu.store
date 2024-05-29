export default function PlusIcon(props) {
  return (
    <>
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <mask
          id="mask0_256_1992"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}
        >
          <rect width={24} height={24} fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_256_1992)">
          <path
            d="M11 17H13V13H17V11H13V7H11V11H7V13H11V17ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5Z"
            fill="#1B4559"
          />
        </g>
      </svg>
    </>
  );
}
