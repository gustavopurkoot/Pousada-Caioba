# Pousada Caiobá — Landing Page

Landing page responsiva para a Pousada Caiobá, desenvolvida em **HTML5, CSS3 e JavaScript Vanilla**, sem frameworks ou bibliotecas externas de carrossel.

O projeto foi construído a partir de dois wireframes fornecidos pelo parceiro (versão Desktop e versão Mobile), reproduzindo com fidelidade o layout, a ordem dos elementos e as diferenças propositais de composição entre as duas versões.

## Estrutura de pastas

```
pousada-caioba/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── imagens/
    ├── logo/
    ├── hero/
    ├── secao-2-estrutura/
    │   ├── icones/
    │   └── galeria/
    ├── secao-3-quartos/
    │   └── galeria/
    ├── secao-4-caioba/
    ├── secao-5-localizacao/
    ├── secao-7-contato/
    └── secao-8-avaliacoes/
```

Os nomes de pastas e arquivos de imagem foram normalizados para **kebab-case**, sem acentos ou espaços, para evitar problemas de compatibilidade ao hospedar o site.

## Como abrir o projeto

Não é necessário nenhum build ou instalação. Basta abrir o arquivo `index.html` diretamente no navegador, ou servir a pasta com qualquer servidor estático (ex: extensão "Live Server" do VS Code).

## Configuração centralizada (`js/script.js`)

Todos os dados externos que podem mudar no futuro (WhatsApp, Instagram, endereço e vídeos do YouTube) ficam centralizados em um único objeto, no topo do arquivo `js/script.js`:

```js
const CONFIG = {
  whatsappNumber: "5541995696112",
  whatsappMessage: "Olá! Vim pelo site da Pousada Caiobá e gostaria de informações sobre reservas.",
  instagramUrl: "https://www.instagram.com/pousadacaioba_oficial/",
  address: "R. Jacarezinho, 275 - Caiobá, Matinhos - PR, 83260-000",
  youtubeHotelId: "SUBSTITUIR_VIDEO_HOTEL_ID",
  youtubeVideo2Id: "SUBSTITUIR_VIDEO_2_ID",
};
```

Para atualizar qualquer um desses dados, basta editar esse objeto — nenhum outro arquivo precisa ser tocado.

### Vídeos do YouTube

Os dois espaços de vídeo (Hero e seção "Reserve Direto Conosco") ainda usam IDs de placeholder (`SUBSTITUIR_VIDEO_HOTEL_ID` e `SUBSTITUIR_VIDEO_2_ID`). Assim que os vídeos finais forem publicados no YouTube, substitua esses dois valores pelo ID real do vídeo (a parte final da URL, depois de `v=`).

## Funcionalidades

- **Carrossel reutilizável** (`class Gallery` em `script.js`): usado tanto na galeria de estrutura quanto na de quartos. Possui:
  - navegação por setas, dots, teclado (setas do teclado) e swipe (Pointer Events, funciona com toque e mouse);
  - loop circular e autoplay suave, que respeita `prefers-reduced-motion` e pausa ao interagir;
  - frame de tamanho fixo — a troca de foto nunca muda a altura do carrossel.
- **Vídeos responsivos**: os iframes do YouTube são inseridos dinamicamente em um wrapper com `aspect-ratio: 16/9`, evitando layout shift.
- **Seção de localização**: composição fixa com 3 fotos (não é carrossel), conforme o wireframe.
- **Contatos e CTAs**: endereço abre o Google Maps, telefone abre o WhatsApp com mensagem pré-preenchida, Instagram abre o perfil — cada bloco (ícone + texto) é uma única área clicável.

## Responsividade

Não existem páginas separadas para desktop e mobile. O layout é controlado inteiramente por CSS (Flexbox, Grid e media queries), com o breakpoint principal em `900px`. Elementos que aparecem só em uma versão (como a galeria da seção 2, oculta no mobile) seguem exatamente o que os wireframes definiram — não foram adicionados nem removidos por conta própria.

## Observações

- Este README documenta o estado atual do projeto; qualquer ajuste visual futuro deve continuar comparando a implementação com os dois PDFs de wireframe (Desktop e Mobile) para manter a fidelidade.
- O código não possui `console.log` de depuração nem dependências externas além das fontes do Google Fonts (Playfair Display e Poppins).
