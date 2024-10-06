from django.shortcuts import render
from django.http import HttpResponse
from transformers import MarianTokenizer,MarianMTModel
from huggingface_hub import InferenceClient
from django.http import JsonResponse
import json
token = "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"

client = InferenceClient(
    "mistralai/Mistral-Nemo-Instruct-2407",
    token=token
)

model_name = 'Helsinki-NLP/opus-mt-ar-en'
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

def index(request):
    return render(request, 'pages/index.html',{"name" : "ok"})
def about(request):
    return render(request,'pages/about.html')
# Create your views here.
def translate_text(text: str) -> str:
    # Tokenize the input text and prepare it for translation
    tokenized_text = tokenizer.prepare_seq2seq_batch([text], return_tensors='pt')
    # Generate translation
    translated = model.generate(**tokenized_text)
    # Decode the translated text
    translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)
    return translated_text


def translate_view(request):
    if request.method == 'POST':
        arabic_text = request.POST.get('arabic_text')
        translated_text = translate_text(arabic_text)
        return render(request, 'pages/translate_result.html', {
            'arabic_text': arabic_text,
            'translated_text': translated_text
        })

    return render(request, 'pages/translate_form.html')

def give_text(request):
    if request.method == 'POST':
        x = request.POST.get('x')
        return render(request, 'pages/de.html', {

            'x' : x

        })
    return render(request, 'pages/give_text.html')
def solar(request):
    return render(request, 'pages/solar.html')
def ask_model(question):
    try:
        response_text = ""
        for message in client.chat_completion(
                messages=[{"role": "user", "content": question}],
                max_tokens=500,
                stream=True
        ):
            response_text += message.choices[0].delta.content
        return response_text
    except Exception as e:
        return f"Error: {str(e)}"
def chatbot(request):
    if request.method == "POST":
        user_question = request.POST.get('question')
        answer = ask_model(user_question)
        # Return the answer as JSON
        return JsonResponse({'answer': answer})
    return render(request, 'pages/index.html')

def question_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question = data.get('question', '')

        # Process the question and generate an answer
        answer = f"Received your question: {question}"

        # Return the answer as a JSON response
        return JsonResponse({'answer': answer})