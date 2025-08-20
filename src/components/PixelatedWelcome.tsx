'use client'

import { useState, useEffect } from 'react'

const WELCOME_TEXTS = [
  'Welcome!', // English
  'Selamat Datang!', // Indonesian
  'Bienvenue!', // French
  'Bienvenido!', // Spanish
  'Willkommen!', // German
  'Benvenuto!', // Italian
  'Добро пожаловать!', // Russian
  'いらっしゃいませ!', // Japanese
  '환영합니다!', // Korean
  '欢迎!', // Chinese (Simplified)
  'مرحبا!', // Arabic
  'स्वागत!', // Hindi
  'Bem-vindo!', // Portuguese
  'Welkom!', // Dutch
  'Välkommen!', // Swedish
  'Velkommen!', // Norwegian/Danish
  'Tervetuloa!', // Finnish
  'Καλώς ήρθατε!', // Greek
  'ברוכים הבאים!', // Hebrew
  'Hoş geldiniz!', // Turkish
  'Witamy!', // Polish
  'Vítejte!', // Czech
  'Vitajte!', // Slovak
  'Dobrodošli!', // Croatian/Serbian/Bosnian
  'Bun venit!', // Romanian
  'Bienvenidos!', // Spanish (plural)
  'Üdvözöljük!', // Hungarian
  'Tere tulemast!', // Estonian
  'Laipni lūdzam!', // Latvian
  'Sveiki atvykę!', // Lithuanian
  'Dobrodošao!', // Montenegrin
  'Mirë se vini!', // Albanian
  'Բարի գալուստ!', // Armenian
  'მოგესალმებით!', // Georgian
  'Қош келдіңіз!', // Kazakh
  'Хуш омадед!', // Tajik
  'Xoş gəlmisiniz!', // Azerbaijani
  'Hoşgeldin!', // Turkish (informal)
  'Chào mừng!', // Vietnamese
  'ยินดีต้อนรับ!', // Thai
  'ស្វាគមន៍!', // Khmer
  'ကြိုဆိုပါတယ်!', // Myanmar
  'Maligayang pagdating!', // Filipino
  'Talofa!', // Samoan
  'Kia ora!', // Maori
  'Ahoj!', // Czech (informal)
  'Hola!', // Spanish (informal)
  'Salut!', // French (informal)
  'Hej!', // Swedish (informal)
  'Hallo!', // German (informal)
  'Ciao!', // Italian (informal)
  'Olá!', // Portuguese (informal)
  'नमस्ते!', // Hindi (Namaste)
  'السلام عليكم!', // Arabic (formal greeting)
  'こんにちは!', // Japanese (Hello)
  '안녕하세요!', // Korean (Hello)
  '你好!', // Chinese (Hello)
  'Zdravo!', // Serbian (Hello)
  'Aloha!', // Hawaiian
  'Jambo!', // Swahili
  'Sawubona!', // Zulu
  'Dumela!', // Setswana
  'Habari!', // Swahili (informal)
  'Shalom!', // Hebrew
  'Salam!', // Persian/Farsi
  'Merhaba!', // Turkish
  'Γεια σας!', // Greek (Hello)
  'Zdravstvuyte!', // Russian (formal)
  'Privyet!', // Russian (informal)
  'Dzień dobry!', // Polish (Good day)
  'Bună!', // Romanian (Hello)
  'Ahlan!', // Arabic (informal)
  'Sawasdee!', // Thai
  'Xin chào!', // Vietnamese
  'Kumusta!', // Filipino
  'Bonjou!', // Haitian Creole
  'Bongu!', // Maltese
  'Saluton!', // Esperanto
  'Hæ!', // Icelandic
  'Góðan dag!', // Faroese
  'Demat!', // Breton
  'Kaixo!', // Basque
  'Ola!', // Galician
  'Bon dia!', // Catalan
  'Benvingut!', // Catalan
  'Benvenuto!', // Corsican
  'Benvegnù!', // Venetian
  'Salvete!', // Latin
  'Ave!', // Latin (informal)
]

export default function PixelatedWelcome() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pixels, setPixels] = useState<boolean[][]>([])

  const currentText = WELCOME_TEXTS[currentIndex]

  // Create pixelated grid based on text length - smaller and more focused
  useEffect(() => {
    const gridWidth = Math.max(8, Math.ceil(currentText.length * 0.5))
    const gridHeight = 5
    const newPixels = Array(gridHeight).fill(null).map(() => 
      Array(gridWidth).fill(false)
    )
    setPixels(newPixels)
  }, [currentText])

  // Animate pixels during transition
  useEffect(() => {
    if (!isTransitioning) return

    const animatePixels = () => {
      setPixels(prev => 
        prev.map(row => 
          row.map(() => Math.random() > 0.3)
        )
      )
    }

    const interval = setInterval(animatePixels, 100)
    
    setTimeout(() => {
      clearInterval(interval)
      setPixels(prev => 
        prev.map(row => row.map(() => false))
      )
      setIsTransitioning(false)
    }, 800)

    return () => clearInterval(interval)
  }, [isTransitioning])

  // Change text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % WELCOME_TEXTS.length)
      }, 400)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative inline-block">
      <h1 className={`text-4xl font-semibold transition-opacity duration-300 ${
        isTransitioning ? 'opacity-20' : 'opacity-100'
      }`}>
        {currentText}
      </h1>
      
      {/* Pixelated overlay - more contained */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300 ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="grid gap-0.5" style={{
          gridTemplateColumns: `repeat(${pixels[0]?.length || 8}, 1fr)`,
          gridTemplateRows: `repeat(${pixels.length}, 1fr)`,
          width: `${Math.min(currentText.length * 16, 300)}px`,
          height: '48px'
        }}>
          {pixels.flat().map((isActive, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 transition-all duration-100 rounded-sm ${
                isActive 
                  ? 'bg-black dark:bg-white' 
                  : 'bg-transparent'
              }`}
              style={{
                opacity: isActive ? Math.random() * 0.7 + 0.3 : 0
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
