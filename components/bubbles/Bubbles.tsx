import { useEffect, useRef, useState } from "react"

const Bubbles = ({ message, username = 'user' }: any) => {
  const canvasRef = useRef<any>(null)
  const containerRef = useRef<any>(null)
  const animationRef = useRef<any>(null)
  const [fixedBubbles, setFixedBubbles] = useState<any>([])
  const lastMessageRef = useRef("")

  useEffect(() => {
    const canvas: any = canvasRef.current
    const container: any = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    const movingBubbles = [] as any

    const updateSize = () => {
      canvas.width = container.clientWidth
      canvas.height = Math.max(container.clientHeight, (fixedBubbles.length + 1) * 100 + 80)
      canvas.style.height = `${canvas.height}px`
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    const getRandomColor = () => {
      const colors = [
        "rgba(135, 206, 235, 0.8)", // Light blue
        "rgba(255, 182, 193, 0.8)", // Light pink
        "rgba(144, 238, 144, 0.8)", // Light green
        "rgba(255, 0, 0, 0.8)", // red
        "rgba(221, 160, 221, 0.8)", // Plum
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    class Bubble {
      text: string
      isMoving: boolean
      x: number
      targetY: number
      y: number
      padding: number
      fontSize: number
      speed: number
      angle: number
      reachedTarget: boolean
      animationPhase: number
      color: string
      width: number
      height: number
      date?: string
      nameFontSize: number
      dateFontSize: number
      dateMargin: number
    
      constructor(text: any, isMoving = true, index = 0) {
        console.log(index)
    
        this.text = text
        this.isMoving = isMoving
        this.x = Math.random() * (canvas.width * 0.6) + canvas.width * 0.2
        this.targetY = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2
        this.y = isMoving ? canvas.height + 100 : this.targetY
    
        this.padding = 23
        this.fontSize = 16
        this.speed = 5
        this.angle = 0
        this.reachedTarget = false
        this.animationPhase = 0
        this.nameFontSize = 14
        this.dateFontSize = 12
        this.dateMargin = 5
        this.color = getRandomColor()
    
        // Calculate bubble dimensions based on text and date
        ctx.font = `${this.fontSize}px Arial`
        const textMetrics = ctx.measureText(this.text)
        ctx.font = `bold ${this.dateFontSize}px Arial`
        const dateMetrics = ctx.measureText(this.date)
        // Use the larger of text width or date width, plus padding
        this.width = Math.min(Math.max(textMetrics.width, dateMetrics.width) + this.padding * 2, canvas.width * 0.7)
    
        // Tambahkan ruang untuk date dalam perhitungan tinggi
        const textHeight = this.fontSize + this.padding * 2
        const dateHeight = this.dateFontSize + this.dateMargin * 2
        this.height = textHeight + dateHeight // Tinggi total termasuk ruang untuk date
    
        // Get current date
        const now = new Date()
        this.date = now.toLocaleDateString()
      }
    
      drawSpeechBubble(ctx: any, x: any, y: any, width: any, height: any, radius: any) {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + 30, y + height)
        ctx.lineTo(x + 15, y + height + 15)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
      }
    
      draw(ctx: any) {
        ctx.save()
    
        // Draw username
        ctx.font = `bold ${this.nameFontSize}px Arial`
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.textAlign = "left"
        ctx.fillText(username, this.x - this.width / 2, this.y - this.height / 2 - 10)
    
        // Draw speech bubble
        ctx.fillStyle = this.color
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 2
        this.drawSpeechBubble(ctx, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10)
        ctx.fill()
        ctx.stroke()
    
        // Draw text
        ctx.fillStyle = "rgba(255, 255, 255, 1)"
        ctx.font = `${this.fontSize}px Arial`
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
    
        // Word wrap text
        const words = this.text.split(" ")
        let line = ""
        let y = this.y - this.dateFontSize // Geser text ke atas sedikit untuk memberi ruang date
        const maxWidth = this.width - this.padding * 2
    
        words.forEach((word) => {
          const testLine = line + word + " "
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && line !== "") {
            ctx.fillText(line, this.x - this.width / 2 + this.padding, y)
            line = word + " "
            y += this.fontSize + 5
          } else {
            line = testLine
          }
        })
        ctx.fillText(line, this.x - this.width / 2 + this.padding, y)
    
        // Draw date
        ctx.font = `bold ${this.dateFontSize}px Arial`
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.fillText(
          this.date,
          this.x - this.width / 2 + this.padding,
          this.y + this.height / 2 - this.dateMargin - this.dateFontSize, // Posisikan date di bagian bawah bubble
        )
    
        ctx.restore()
      }
    
      update() {
        if (!this.isMoving) {
          this.animationPhase += 0.05
          this.y = this.targetY + Math.sin(this.animationPhase) * 5
          return true
        }
    
        if (this.y > this.targetY) {
          this.y -= this.speed
        } else if (!this.reachedTarget) {
          this.reachedTarget = true
          this.isMoving = false
          return "fixed"
        }
    
        return true
      }
    }

    if (message !== lastMessageRef.current) {
      lastMessageRef.current = message
      movingBubbles.push(new Bubble(message, true, fixedBubbles.length))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      fixedBubbles.forEach((bubble: any, index:any) => {
        console.log(index);
        
        bubble.draw(ctx)
      })

      for (let i = movingBubbles.length - 1; i >= 0; i--) {
        const bubble = movingBubbles[i]
        const result = bubble.update()

        if (result === "fixed") {
          setFixedBubbles((prev: any) => [...prev, bubble])
          movingBubbles.splice(i, 1)

          // Auto scroll to bottom when new bubble is added
          container.scrollTop = container.scrollHeight
        } else if (result) {
          bubble.draw(ctx)
        } else {
          movingBubbles.splice(i, 1)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [message, username, fixedBubbles])

  useEffect(() => {
    if (message !== lastMessageRef.current) {
      setFixedBubbles([])
    }

    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [message, fixedBubbles])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-auto bg-opacity-50 bg-clip-padding backdrop-filter backdrop-blur-sm relative"
      style={{
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full pointer-events-none absolute top-0 left-0"
        style={{
          height: `${Math?.max(window.innerHeight, (fixedBubbles.length + 1) * 100 + 80)}px`,
        }}
      />
    </div>
  )
}

export default Bubbles

