export default function TooltipCell ({ text }) {
  return (
    <td>
      <div className='tooltip-container'>
        <p className='td-text'>{text}</p>
        <span className='tooltip'>{text}</span>
      </div>
    </td>
  )
}
