export default function(e, ctx) {
  console.log('lambda called')
  ctx.succeed('success')
}
