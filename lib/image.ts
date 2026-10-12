export async function resizeImage(file: File, maxEdge = 1600): Promise<string> {
  if (typeof window === 'undefined') throw new Error('फ़ोटो तैयार करने के लिए इसे अपने ब्राउज़र में खोलिए।')
  if (!file.type.startsWith('image/') || !file.size) throw new Error('कृपया फ़ोटो वाली फ़ाइल चुनिए।')
  if (!Number.isFinite(maxEdge) || maxEdge < 1) throw new Error('फ़ोटो का आकार सही नहीं है। दोबारा कोशिश कीजिए।')
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('फ़ोटो नहीं खुल पाई। दूसरी फ़ोटो चुनिए।'))
      image.src = url
    })
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('फ़ोटो साफ़ नहीं दिख रही। दूसरी फ़ोटो चुनिए।')
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('फ़ोटो तैयार नहीं हो पाई। ब्राउज़र दोबारा खोलिए।')
    context.fillStyle = '#F6F8F6'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.82)
  } finally {
    URL.revokeObjectURL(url)
  }
}
