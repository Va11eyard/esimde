package services

import (
	"context"
	"errors"
	"esimde-backend/internal/config"

	openai "github.com/sashabaranov/go-openai"
)

type OpenAIService struct {
	client *openai.Client
}

func NewOpenAIService(cfg *config.Config) *OpenAIService {
	if cfg.OpenAIAPIKey == "" {
		return &OpenAIService{client: nil}
	}
	return &OpenAIService{
		client: openai.NewClient(cfg.OpenAIAPIKey),
	}
}

func (s *OpenAIService) ChatCompletion(ctx context.Context, userPrompt string) (string, error) {
	if s.client == nil {
		// Mock response when API key is not configured
		return "Сәлеметсіз бе! Мен Esimde когнитивті денсаулық ассистентімін. Мен сізге когнитивті тесттер, есте сақтау қабілеті және дәрігерлерге жазылу бойынша көмектесе аламын.", nil
	}

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "Ты — заботливый ИИ-ассистент платформы когнитивного здоровья Esimde (Sen.AI). Твоя цель — вежливо отвечать пользователю на казахском или русском языках, давать полезные советы по уходу за памятью пожилых близких и помогать сориентироваться в медицинских вопросах.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userPrompt,
				},
			},
		},
	)

	if err != nil {
		return "", err
	}

	if len(resp.Choices) == 0 {
		return "", errors.New("empty response from OpenAI")
	}

	return resp.Choices[0].Message.Content, nil
}
